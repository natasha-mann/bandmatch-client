import React, { useEffect, useCallback } from "react";

import "../../App.css";
import "./FilterStrip.css";

import Button from "../Button/index";

import { Modal } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import MultiSelectDropDown from "../MultiSelectDropdown";
import { useUserContext } from "../../contexts/UserProvider";
import { GENRESINSTRUMENTS } from "../../graphql/queries";
import { useModal } from "../../contexts/ModalProvider";

const FilterStrip = (props) => {
  const { dispatch, state } = useUserContext();
  const { setModalState } = useModal();

  const { handleSubmit, control } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const handleApplyFilters = useCallback(
    ({ genre, instruments, experienceLevel, lookingFor, userType }) => {
      const payload = {
        genre,
        instruments,
        experienceLevel,
        lookingFor,
        userType,
      };

      // save filters in global context
      dispatch({
        type: "SETUSERFILTERS",
        payload,
      });

      // hide modal
      setModalState({
        open: false,
        content: null,
      });

      // save filters in local storage, in case page is reloaded
      const filters = JSON.stringify(payload);

      localStorage.setItem("userFilters", filters);
    },
    [dispatch, setModalState]
  );

  const [getFilterOptions, { data, loading, error, called }] = useLazyQuery(
    GENRESINSTRUMENTS
  );

  useEffect(() => {
    if (called && !loading && !error) {
      // using !data instead of err here as on first mount data is not present.
      if (!data) {
        setModalState({
          open: true,
          content: (
            <Modal.Body className="solid-background">
              <p> Sorry, we couldn't load filtering options at this time </p>
            </Modal.Body>
          ),
        });
      } else {
        const serverGenres = data.genres.map((genre) => {
          return {
            value: genre.id,
            label: genre.name,
          };
        });

        const instruments = data.instruments.map((instrument) => {
          return {
            value: instrument.id,
            label: instrument.name,
          };
        });

        const musicalRoles = data.instruments.map((instrument) => {
          return {
            value: instrument.id,
            label: instrument.role,
          };
        });

        setModalState({
          open: true,
          content: (
            <>
              <Modal.Header
                closeButton
                className="solid-background"
                closeVariant="white"
              >
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  className="title"
                >
                  SELECT FILTERS
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="solid-background">
                <form onSubmit={handleSubmit(handleApplyFilters)}>
                  <p>LOCATION</p>
                  <MultiSelectDropDown
                    options={serverGenres}
                    defaultValue={state.userFilters.genre}
                    placeholder="Select genre"
                    isMulti={true}
                    name="genre"
                    control={control}
                    label="Genre"
                  />
                  <MultiSelectDropDown
                    options={instruments}
                    defaultValue={state.userFilters.instruments}
                    placeholder="Select instruments"
                    isMulti={true}
                    name="instruments"
                    control={control}
                    label="Instruments"
                  />
                  <MultiSelectDropDown
                    options={musicalRoles}
                    defaultValue={state.userFilters.lookingFor}
                    placeholder="Select instruments"
                    isMulti={true}
                    name="lookingFor"
                    control={control}
                    label="Looking for"
                  />
                  <MultiSelectDropDown
                    options={[
                      { value: "newbie", label: "newbie" },
                      { value: "midway", label: "midway" },
                      { value: "expert", label: "expert" },
                    ]}
                    defaultValue={state.userFilters.experienceLevel}
                    placeholder="Select experience level"
                    isMulti={true}
                    name="experienceLevel"
                    control={control}
                    label="Experience level"
                  />
                  <MultiSelectDropDown
                    options={[
                      { value: "band", label: "band" },
                      { value: "musician", label: "musician" },
                    ]}
                    defaultValue={state.userFilters.userType}
                    placeholder="Select performer type"
                    isMulti={true}
                    name="userType"
                    control={control}
                    label="Band or Musician"
                  />
                  <Button
                    type="submit"
                    label="APPLY"
                    mode="primary"
                    size="medium"
                  />
                </form>
              </Modal.Body>
            </>
          ),
        });
      }
    }
  }, [
    called,
    control,
    data,
    error,
    handleApplyFilters,
    handleSubmit,
    loading,
    setModalState,
    state.userFilters,
  ]);

  return (
    <div className="filter-strip-container see-through-background-90">
      <div className="filter-strip-elements-container gutter">
        <p className="title">{props.title}</p>
        <Button
          label="FILTER"
          size="small"
          mode="secondary"
          onClick={() => getFilterOptions()}
        />
      </div>
    </div>
  );
};

export default FilterStrip;
